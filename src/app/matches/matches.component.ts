import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FootballService } from '../football.service';

interface Team {
  logo: string;
  name: string;
  
}

interface Match {
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number;
    away: number;
  };
  
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  matchId!: string;
  lastMatches: Match[] | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private footballService: FootballService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.matchId = params['id'];
      this.callApi();
    });
  }

  callApi(): void {
    this.footballService.getMatches(this.matchId).subscribe(
      (data: { response: Match[] }) => {
        this.lastMatches = data.response.slice(0, 10);
        console.log("DDDDDDDDDDDDDDDDDDDDDDDDD", this.lastMatches);
      },
     
    );
  }

  goBack(): void {
    
    this.router.navigate(['']);
  }
}
