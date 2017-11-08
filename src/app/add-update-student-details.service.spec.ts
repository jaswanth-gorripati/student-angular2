import { TestBed, inject } from '@angular/core/testing';

import { AddUpdateStudentDetailsService } from './add-update-student-details.service';

describe('AddUpdateStudentDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddUpdateStudentDetailsService]
    });
  });

  it('should be created', inject([AddUpdateStudentDetailsService], (service: AddUpdateStudentDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
