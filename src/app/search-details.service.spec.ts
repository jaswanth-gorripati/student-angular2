import { TestBed, inject } from '@angular/core/testing';

import { SearchDetailsService } from './search-details.service';

describe('SearchDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchDetailsService]
    });
  });

  it('should be created', inject([SearchDetailsService], (service: SearchDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
