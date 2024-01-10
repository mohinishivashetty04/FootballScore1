import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { trigger, transition, style, animate } from '@angular/animations';
import { FootballService } from '../football.service';
import { Router, ActivatedRoute } from '@angular/router';

interface Team {
  id: number;
  logo: string;
  name: string;

}

interface Standings {
  rank: number;
  team: Team;
  all: {
    played: number;
    win: number;
    lose: number;
    draw: number;
   
  };
  goalsDiff: number;
  points: number;
 
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('translateTab', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  tabs: { label: string; code: number; content: Standings[] }[] = [
    { label: 'England', code: 39, content: [] },
    { label: 'Spain', code: 140, content: [] },
    { label: 'France', code: 61, content: [] },
    { label: 'Germany', code: 78, content: [] },
    { label: 'Italy', code: 135, content: [] }
  ];


  constructor(
    private footballService: FootballService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadTabContent();
  }

  loadTabContent(): void {
    this.tabs.forEach(tab => {
      const localStorageKey = `footballContent_${tab.code}`;

      const storedContent = localStorage.getItem(localStorageKey);

      if (storedContent) {
        tab.content = JSON.parse(storedContent) as Standings[];
        tab.content = tab.content.flat();
      } else {
        this.footballService.getContent(tab.code).subscribe(
          (content: { response: [{ league: { standings: Standings[] } }] }) => {
            tab.content = content.response[0].league.standings;
            tab.content = tab.content.flat();
            console.log("%%%%%%%%%%%%%%%%%%%5555",tab.content)
            localStorage.setItem(localStorageKey, JSON.stringify(content.response[0].league.standings));
          },
          (error: any) => {
            console.error(`Error fetching content for ${tab.label}:`, error);
          }
        );
      }
    });
  }

  ngAfterViewInit(): void {
    const selectedTab = localStorage.getItem('selectedTab');
    console.log("!!!!!!!!!!!!!!!!!!!", selectedTab)
    const spainTabIndex = this.tabs.findIndex(tab => tab.label === selectedTab);
    if (spainTabIndex !== -1) {
      this.tabGroup.selectedIndex = spainTabIndex;
    }
  }

  navigateToTeamPage(teamId: number, currentTab: string): void {
    localStorage.setItem('selectedTab', currentTab);
    this.router.navigate(['matches', teamId]);
  }
}
