import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginRegisterComponent } from "../../login-register/login-register.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LoginRegisterComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
