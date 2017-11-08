import { TestBed, inject } from '@angular/core/testing';

import { CreateArtifactsService } from './create-artifacts.service';

describe('CreateArtifactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateArtifactsService]
    });
  });

  it('should be created', inject([CreateArtifactsService], (service: CreateArtifactsService) => {
    expect(service).toBeTruthy();
  }));
});
