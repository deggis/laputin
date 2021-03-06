import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "search-box",
    template: `
    <div>
        <input
            class="form-control"
            type="text"
            [(ngModel)]="term"
            (keyup)="onKeyUp($event)" />
    </div>`
})
export class SearchBox {
    public term: string = "";
    
    // Fake boolean because true values are passed to input properties as 1.
    @Input()
    public clearOnEnter: number = 0;
    
    @Output()
    public update: EventEmitter<string> = new EventEmitter<string>();
    
    public onKeyUp($event: KeyboardEvent): void {
        const ENTER: number = 13;
        const ESC: number = 27;

        if ($event.which == ENTER) {
            this.update.emit(this.term);
            
            if (this.clearOnEnter == 1) {
                this.clear();
            }
        }
        
        if ($event.which == ESC) {
            this.clear();
        }
    }
    
    private clear(): void {
        this.term = "";
    }
}