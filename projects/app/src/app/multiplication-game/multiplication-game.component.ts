import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { interval, Subscription } from 'rxjs';

type Square = {
    color: string;
};

@Component({
    selector: 'multiplication-game',
    templateUrl: './multiplication-game.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
    ],
})
export class MultiplicationGameComponent implements OnInit {
    gridSquares: Square[] = [];
    answerInput = new FormControl(0, [Validators.required]);
    isCorrect: boolean = false;
    isOverflow: boolean = false;
    timeLeft: number = 60;
    timerSubscription: Subscription = new Subscription();
    rows: number = 0;
    columns: number = 0;
    score: number = 0;

    ngOnInit() {
        this.startGame();
        this.answerInput.valueChanges.subscribe(() => {
            this.checkAnswer();
        });
    }

    startGame() {
        this.generateGrid();
        this.startTimer();
    }

    getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateGrid() {
        this.rows = this.getRandomInt(3, 6);
        this.columns = this.getRandomInt(3, 6);
        const totalSquares = this.rows * this.columns;
        this.gridSquares = Array(totalSquares).fill({
            color: 'bg-[lightgray]',
        });
    }

    checkAnswer() {
        const userAnswer = this.answerInput?.value ?? 0;
        const correctAnswer = this.rows * this.columns;
        if (userAnswer < correctAnswer) {
            const remainingSquares = correctAnswer - userAnswer;
            this.gridSquares = this.gridSquares.map((_, i) => {
                if (i < remainingSquares) {
                    return { color: 'bg-[red]' };
                } else {
                    return { color: 'bg-[lightgray]' };
                }
            });
            this.isOverflow = false;
            this.isCorrect = false;
        } else if (userAnswer > correctAnswer) {
            this.gridSquares = this.gridSquares.map(() => ({
                color: 'bg-[red]',
            }));
            this.isOverflow = true;
            this.isCorrect = false;
        } else {
            this.gridSquares = this.gridSquares.map(() => ({
                color: 'bg-[green]',
            }));
            this.isOverflow = false;
            this.isCorrect = true;
            this.score++;
            this.generateGrid();
        }
    }

    startTimer() {
        this.timerSubscription = interval(1000).subscribe(() => {
            this.timeLeft--;
            if (this.timeLeft === 0) {
                this.timerSubscription.unsubscribe();
            }
        });
    }
}
