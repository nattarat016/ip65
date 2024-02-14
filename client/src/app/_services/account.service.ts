import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { User } from '../_models/user'
import { environment } from 'src/environments/environment'
import { PresenceService } from './presence.service'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // baseUrl = 'https://localhost:7777/api/'
  baseUrl = environment.apiUrl

  constructor(private presenceService: PresenceService, private http: HttpClient) { }

  private currentUserSource = new BehaviorSubject<User | null>(null)
  currentUser$ = this.currentUserSource.asObservable()

  login(model: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map((user: User) => {
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user))
          // this.currentUserSource.next(user)
          this.setCurrentUser(user)
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('user')
    this.currentUserSource.next(null)
    this.presenceService.stopHubConnection() //<--
  }

  setCurrentUser(user: User) {
    user.roles = []
    const roles = this.decodeToken(user.token).role
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles)
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSource.next(user)
    this.presenceService.createHubConnection(user) //<--
  }

  decodeToken(token: string) {
    const claims = atob(token.split('.')[1])
    return JSON.parse(claims)
  }

  register(model: any) {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(
      map(user => {
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user))
          // this.currentUserSource.next(user)
          this.setCurrentUser(user)
        }
      })
    )
  }

}