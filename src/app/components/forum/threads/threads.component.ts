import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  forumId: number;

  constructor(
    private route: ActivatedRoute
  ) {
    this.forumId = +this.route.snapshot.paramMap.get('forumId');
    console.log(this.forumId);
  }

  ngOnInit(): void {
  }

}
