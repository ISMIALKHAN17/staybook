import { Component, TemplateRef } from '@angular/core';

import { ToastService } from 'src/app/services/toast.service';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.css'],
  standalone: true,
	imports: [NgbToastModule, NgIf, NgTemplateOutlet, NgFor],
  host: { class: 'toast-container toasts position-fixed  bottom-0 m-auto end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsContainerComponent {
	constructor(public toastService: ToastService) {}

	isTemplate(toast:any) {
		return toast.textOrTpl instanceof TemplateRef;
	}
}
