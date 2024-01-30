import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member ';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent  implements OnInit {
  members: Member[] | undefined
  predicate = 'liked'
  constructor(private memberService: MembersService) { }
  loadLikes() {
    this.memberService.getLikes(this.predicate).subscribe({
      next: members => this.members = members
    })
  }
  ngOnInit(): void {
    this.loadLikes()
  }
}