import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Global } from '../../../environment/global.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GuestService } from '../../../services/guest.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-show-producto',
  standalone: true,
  imports: [NgbCarouselModule, HeaderComponent, FooterComponent, NgbCarousel, FormsModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent {

  public slug: any;
  public producto: any = {};
  public config_global: any = {};
  public url: string;
  public isLoading: boolean = true;
  public productos_rec: Array<any> = [];
  public activeSlideId: string = '0';

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private guestService: GuestService,
    private clienteService: ClienteService,
  ) {
    this.url = Global.url;
    this.clienteService.obtener_config_publico().subscribe(
      (response) => {
        if (response.data == undefined) {
          this.producto = undefined;
        } else {
          this.producto = response.data;
        }
        console.log(this.producto);
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      this.guestService.obtener_productos_slug_public(this.slug).subscribe(response => {
        this.producto = response.data;
        console.log('Producto:', this.producto);
        this.isLoading = false;
        this.guestService
        .listar_productos_recomendados_public(this.producto.categoria)
        .subscribe((response) => {
          this.productos_rec = response.data;
        });
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
    });
  }

  goToSlide(carousel: NgbCarousel, slideId: number): void {
    this.activeSlideId = slideId.toString();
    carousel.select(this.activeSlideId);
  }

  scrollLeft(): void {
    this.carouselContainer.nativeElement.scrollLeft -= this.carouselContainer.nativeElement.clientWidth;
  }

  scrollRight(): void {
    this.carouselContainer.nativeElement.scrollLeft += this.carouselContainer.nativeElement.clientWidth;
  }

}
