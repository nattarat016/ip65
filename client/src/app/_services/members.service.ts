import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { User } from '../_models/user'
import { Member } from '../_models/member '
import { map, of, take } from 'rxjs'
import { PaginationResult } from '../_models/pagination'
import { UserParams } from '../_models/userParams'
import { AccountService } from './account.service'
import { getPaginationHeaders, getPaginationResult } from './paginationhelper'
import { ListParams } from '../_models/listParams'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = []
  memberCache = new Map()
  // userParams: UserParams | undefined
  user: User | undefined
  // paginationResult: PaginationResult<Member[]> = new PaginationResult<Member[]>


  constructor(private accountService: AccountService, private http: HttpClient) {
  }

  private _key(userParams: UserParams) {
    return Object.values(userParams).join('_')
  }

  // private getPaginationHeaders(pageNumber: number, pageSize: number) {
  //   let params = new HttpParams()
  //   params = params.append('pageNumber', pageNumber)
  //   params = params.append('pageSize', pageSize)
  //   return params
  // }
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
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
    const key = this._key(userParams)
    const response = this.memberCache.get(key)
    if (response) return of(response)

    params = params.append('minAge', userParams.minAge)
    params = params.append('maxAge', userParams.maxAge)
    params = params.append('gender', userParams.gender)
    params = params.append('orderBy', userParams.orderBy)
    const url = this.baseUrl + 'users'
    return getPaginationResult<Member[]>(url, params, this.http)
    // return getPaginationResult<Member[]>(url, params, key).pipe(
    //   map(response => {
    //     this.memberCache.set(key, response)
    //     return response
    //   })
    // )
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

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(listParams: ListParams) {
    // let params = getPaginationHeaders(pageNumber, pageSize)
    let httpParams = getPaginationHeaders(listParams.pageNumber, listParams.pageSize)
    // params = params.append('predicate', predicate)
    const url = this.baseUrl + 'likes'
    return getPaginationResult<Member[]>(url, httpParams, this.http)
  }

}
