import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  constructor(private heroService: HeroService) {}

  heroes$!: Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  // push a search term into the observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300 ms after the keystroke
      debounceTime(300),

      // ignore the term if it's the same
      distinctUntilChanged(),

      // switch to new search observable
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
