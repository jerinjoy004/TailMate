import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Post } from '../models/post.model';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = new BehaviorSubject<Post[]>([]);
  posts$ = this.posts.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFirebaseMessaging();
  }

  private async initializeFirebaseMessaging() {
    try {
      // Request permission for notifications
      const permStatus = await FirebaseMessaging.requestPermissions();
      
      if (permStatus.receive === 'granted') {
        // Get the FCM token
        const { token } = await FirebaseMessaging.getToken();
        console.log('FCM Token:', token);
        
        // Send the token to your backend
        await this.http.post(`${environment.apiUrl}/fcm-token`, { token }).toPromise();
        
        // Listen for foreground messages
        FirebaseMessaging.addListener('messageReceived', async (message) => {
          // Trigger vibration
          await Haptics.vibrate({ duration: 3000 });
        });
      }
    } catch (error) {
      console.error('Error initializing Firebase Messaging:', error);
    }
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.apiUrl}/posts`, post).pipe(
      map(newPost => {
        const currentPosts = this.posts.getValue();
        this.posts.next([newPost, ...currentPosts]);
        
        // Send push notification for new post
        this.sendPushNotification(newPost);
        
        return newPost;
      })
    );
  }

  private async sendPushNotification(post: Post) {
    try {
      // Send push notification through your backend
      await this.http.post(`${environment.apiUrl}/notifications`, {
        title: 'New Post Added',
        body: `A new post "${post.title}" has been added!`,
        data: { postId: post.id }
      }).toPromise();

      // Trigger vibration
      await Haptics.vibrate({ duration: 3000 });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
} 