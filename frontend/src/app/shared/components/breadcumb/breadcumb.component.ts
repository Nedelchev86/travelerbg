import { Component, OnInit } from '@angular/core';
import { SetBgImageDirective } from '../../../directives/set-bg-image.directive';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcumb',
  standalone: true,
  imports: [SetBgImageDirective, RouterModule, CommonModule],
  templateUrl: './breadcumb.component.html',
  styleUrl: './breadcumb.component.css',
})
export class BreadcumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  currentPageTitle: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumb(this.activatedRoute.root))
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbs = breadcrumbs;
        this.currentPageTitle = breadcrumbs.length
          ? breadcrumbs[breadcrumbs.length - 1].label
          : '';
      });
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const breadcrumbLabel = child.snapshot.data['breadcrumb'];
      if (
        breadcrumbLabel &&
        !breadcrumbs.some((breadcrumb) => breadcrumb.label === breadcrumbLabel)
      ) {
        const breadcrumb: Breadcrumb = {
          label: breadcrumbLabel,
          url: url,
        };
        breadcrumbs.push(breadcrumb);
      }

      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
