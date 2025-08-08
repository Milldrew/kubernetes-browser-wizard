import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterIpInfoComponent } from './cluster-ip-info.component';

describe('ClusterIpInfoComponent', () => {
  let component: ClusterIpInfoComponent;
  let fixture: ComponentFixture<ClusterIpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterIpInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterIpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
