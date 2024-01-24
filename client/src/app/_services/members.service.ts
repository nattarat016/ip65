import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { User } from '../_models/user'
import { Member } from '../_models/member '
import { map, of, take } from 'rxjs'
import { PaginationResult } from '../_models/pagination'
import { UserParams } from '../_models/userParams'
import { AccountService } from './account.service'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = []
  memberCache = new Map()
  userParams: UserParams | undefined
  user: User | undefined
  // paginationResult: PaginationResult<Member[]> = new PaginationResult<Member[]>


  constructor(private accountService: AccountService, private http: HttpClient) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user)
          this.user = user
        }
      }
    })
  }

  getUserParams() {
    return this.userParams
  }

  setUserParams(params: UserParams) {
    this.userParams = params
  }

  resetUserParams() {
    if (!this.user) return
    this.userParams = new UserParams(this.user)
    return this.userParams
  }

  private _key(userParams: UserParams) {
    return Object.values(userParams).join('_')
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams()
    params = params.append('pageNumber', pageNumber)
    params = params.append('pageSize', pageSize)
    return params
  }
  // getHttpOptions() {
  //   const userString = localStorage.getItem('user')
  //   if (!userString) return
  //   const user: User = JSON.parse(userString)
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
    const key = this._key(userParams)
    const response = this.memberCache.get(key)
    if (response) return of(response)

    params = params.append('minAge', userParams.minAge)
    params = params.append('maxAge', userParams.maxAge)
    params = params.append('gender', userParams.gender)
    params = params.append('orderBy', userParams.orderBy)
    const url = this.baseUrl + 'users'
    return this.getPaginationResult<Member[]>(url, params, key).pipe(
      map(response => {
        this.memberCache.set(key, response)
        return response
      })
    )
  }


  private getPaginationResult<T>(url: string, params: HttpParams, key: string | null) {
    const paginationResult: PaginationResult<T> = new PaginationResult<T>
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body)
          paginationResult.result = response.body

        const pagination = response.headers.get('Pagination')
        if (pagination)
          paginationResult.pagination = JSON.parse(pagination)

        if (key)
          this.memberCache.set(key, paginationResult)

        return paginationResult
      })
    )
  }

  getMember(username: string) {
    // const member = this.members.find(user => user.userName === username)
    // if (member) return of(member)
    const cache = [...this.memberCache.values()]
    const members = cache.reduce((arr, item) => arr.concat(item.result), [])
    const member = members.find((member: Member) => member.userName === username)

    if (member) return of(member)

    return this.http.get<Member>(this.baseUrl + 'users/username/' + username)
  }

  updateProfile(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(_ => {
        const index = this.members.indexOf(member)
        this.members[index] = { ...this.members[index], ...member }
      })
    )
  }

  setMainPhoto(photoId: number) {
    const endpoint = this.baseUrl + 'users/set-main-photo/' + photoId
    return this.http.put(endpoint, {})
  }

  deletePhoto(photoId: number) {
    const endpoint = this.baseUrl + 'users/delete-photo/' + photoId
    return this.http.delete(endpoint)
  }

}
