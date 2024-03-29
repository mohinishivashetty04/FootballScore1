import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Team {
  id: number;
  logo: string;
  name: string;
}

interface AllStats {
  played: number;
  win: number;
  lose: number;
  draw: number;
}

interface Standings {
  rank: number;
  team: Team;
  all: AllStats;
  goalsDiff: number;
  points: number;
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

@Injectable({
  providedIn: 'root',
})
export class FootballService {
  private apiKey = 'f625276623ac96cd63b47f8704edf49c ';
  private apiUrl = 'https://v3.football.api-sports.io';

  constructor(private http: HttpClient) {}

  getContent(country: number): Observable<{ response: [{ league: { standings: Standings[] } }] }> {
    const url = `${this.apiUrl}/standings?league=${country}&season=2023`;

    const headers = new HttpHeaders({
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.apiKey,
    });

    const options = { headers };

    return this.http.get<{ response: [{ league: { standings: Standings[] } }] }>(url, options);
  }

  getMatches(team: string): Observable<{ response: Match[] }> {
    const url = `${this.apiUrl}/fixtures?team=${team}&season=2023`;

    const headers = new HttpHeaders({
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.apiKey,
    });

    const options = { headers };

    return this.http.get<{ response: Match[] }>(url, options);
  }
}
