import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplicationGameComponent } from './multiplication-game.component';

describe('MultiplicationGameComponent', () => {
    let component: MultiplicationGameComponent;
    let fixture: ComponentFixture<MultiplicationGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultiplicationGameComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MultiplicationGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
