import { Component, OnInit } from '@angular/core'
import { Observable, take } from 'rxjs'
import { Member } from 'src/app/_models/member '
import { Pagination } from 'src/app/_models/pagination'
import { User } from 'src/app/_models/user'
import { UserParams } from 'src/app/_models/userParams'
import { AccountService } from 'src/app/_services/account.service'
import { MembersService } from 'src/app/_services/members.service'

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // members: Member[] = []
  // members$: Observable<Member[]> | undefined
  members: Member[] = []
  pagination: Pagination | undefined
  userParams: UserParams | undefined
  // user: User | undefined
  //pageNumber = 1
  //pageSize = 5
  genderList = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' },
    { value: 'non-binary', display: 'Non-binary' },
  ]
  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams()
  }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember() {
    // if (!this.userParams) return
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams)
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result
            this.pagination = response.pagination
          }
        }
      })
    }
  }

  pageChanged(event: any) {
    if (!this.userParams) return
    if (this.userParams.pageNumber === event.page) return
    this.userParams.pageNumber = event.page
    this.memberService.setUserParams(this.userParams)
    this.loadMember()
  }

  resetFilters() {
    if (this.userParams) {
      // this.userParams = new UserParams(this.user)
      this.userParams = this.memberService.resetUserParams()
      this.loadMember()
    }
  }

}
