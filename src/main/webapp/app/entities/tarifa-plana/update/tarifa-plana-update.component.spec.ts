import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TarifaPlanaService } from '../service/tarifa-plana.service';
import { ITarifaPlana, TarifaPlana } from '../tarifa-plana.model';
import { IFacturacion } from 'app/entities/facturacion/facturacion.model';
import { FacturacionService } from 'app/entities/facturacion/service/facturacion.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';

import { TarifaPlanaUpdateComponent } from './tarifa-plana-update.component';

describe('TarifaPlana Management Update Component', () => {
  let comp: TarifaPlanaUpdateComponent;
  let fixture: ComponentFixture<TarifaPlanaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tarifaPlanaService: TarifaPlanaService;
  let facturacionService: FacturacionService;
  let clienteService: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TarifaPlanaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TarifaPlanaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TarifaPlanaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tarifaPlanaService = TestBed.inject(TarifaPlanaService);
    facturacionService = TestBed.inject(FacturacionService);
    clienteService = TestBed.inject(ClienteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Facturacion query and add missing value', () => {
      const tarifaPlana: ITarifaPlana = { id: 456 };
      const facturacion: IFacturacion = { id: 58033 };
      tarifaPlana.facturacion = facturacion;

      const facturacionCollection: IFacturacion[] = [{ id: 17868 }];
      jest.spyOn(facturacionService, 'query').mockReturnValue(of(new HttpResponse({ body: facturacionCollection })));
      const additionalFacturacions = [facturacion];
      const expectedCollection: IFacturacion[] = [...additionalFacturacions, ...facturacionCollection];
      jest.spyOn(facturacionService, 'addFacturacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tarifaPlana });
      comp.ngOnInit();

      expect(facturacionService.query).toHaveBeenCalled();
      expect(facturacionService.addFacturacionToCollectionIfMissing).toHaveBeenCalledWith(facturacionCollection, ...additionalFacturacions);
      expect(comp.facturacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cliente query and add missing value', () => {
      const tarifaPlana: ITarifaPlana = { id: 456 };
      const cliente: ICliente = { id: 2259 };
      tarifaPlana.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 2653 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tarifaPlana });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(clienteCollection, ...additionalClientes);
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tarifaPlana: ITarifaPlana = { id: 456 };
      const facturacion: IFacturacion = { id: 1436 };
      tarifaPlana.facturacion = facturacion;
      const cliente: ICliente = { id: 15041 };
      tarifaPlana.cliente = cliente;

      activatedRoute.data = of({ tarifaPlana });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tarifaPlana));
      expect(comp.facturacionsSharedCollection).toContain(facturacion);
      expect(comp.clientesSharedCollection).toContain(cliente);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TarifaPlana>>();
      const tarifaPlana = { id: 123 };
      jest.spyOn(tarifaPlanaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tarifaPlana });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tarifaPlana }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tarifaPlanaService.update).toHaveBeenCalledWith(tarifaPlana);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TarifaPlana>>();
      const tarifaPlana = new TarifaPlana();
      jest.spyOn(tarifaPlanaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tarifaPlana });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tarifaPlana }));
      saveSubject.complete();

      // THEN
      expect(tarifaPlanaService.create).toHaveBeenCalledWith(tarifaPlana);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TarifaPlana>>();
      const tarifaPlana = { id: 123 };
      jest.spyOn(tarifaPlanaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tarifaPlana });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tarifaPlanaService.update).toHaveBeenCalledWith(tarifaPlana);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFacturacionById', () => {
      it('Should return tracked Facturacion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFacturacionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackClienteById', () => {
      it('Should return tracked Cliente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClienteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
