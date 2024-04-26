import asyncHandler from 'express-async-handler';
import {PagosApi} from '../services/pagos.js';
import {CuotasApi} from '../services/cuotas.js';
import {paymentMethods} from '../utils/paymentMethods.js';
import { Request, Response } from 'express';

export class PagosController{
	pagosApi: PagosApi;
	cuotasApi: CuotasApi;
	aditionalPaymentInformation: Map<any, any>;
	constructor(){
		this.pagosApi = new PagosApi();
		this.cuotasApi = new CuotasApi();
		this.aditionalPaymentInformation = new Map();
	}

	crearOrden = asyncHandler(async(req: any, res: Response) => {
		const {id, club_asociado, deuda} = req.user;
		const mercadoPagoResponse = await this.pagosApi.crearOrdenDePago(req.body, id, club_asociado.id);
		
		this.aditionalPaymentInformation.set('clubAsociado', club_asociado.id);
		this.aditionalPaymentInformation.set('socioDeuda', deuda);
		this.aditionalPaymentInformation.set('socioId', id);
		this.aditionalPaymentInformation.set('cuotasAPagar', req.body.length);
		
		res.status(201).json({success: true, message: 'orden creada con exito', url: mercadoPagoResponse.init_point });
	});	  

	reciveWebhook = asyncHandler(async(req: Request, res: Response) => {
		const cantCuotasAPagar = this.aditionalPaymentInformation.get('cuotasAPagar');
		
		if(req.query.type === 'payment'){
			const order = await this.pagosApi.reciveWebhook(req.query['data.id']);	

			for (let i = 0; i < cantCuotasAPagar; i++) {
				await this.cuotasApi.pagarCuota(
					paymentMethods(order.payment_method_id, order.payment_type_id), 
					this.aditionalPaymentInformation.get('socioDeuda'), 
					this.aditionalPaymentInformation.get('socioId') ,
					order.additional_info.items[i].id, 
					this.aditionalPaymentInformation.get('clubAsociado'),
					order.additional_info.items[i].category_id,
					order.additional_info.items[i].quantity,
				); 
			}    
		} 
		
		res.status(201).json({success: true, message: 'webhook'});
	});	   

	aprobarDebitoAutomatico = asyncHandler(async(req: Request, res: Response) => {
		const {socioId, transactionAmount} = req.body;
		const subscripcion = await this.pagosApi.aprobracionDebitoAutomatico(socioId, transactionAmount);
		console.log(subscripcion)

		res.status(201).json({success: true, message: 'Suscripcion al debito automatico exitosa'});
	})
	
	crearCliente = asyncHandler(async(req: Request, res: Response) => {
		const {socioEmail} = req.body;
		await this.pagosApi.crearCliente(socioEmail);

		res.status(201).json({success: true, message: 'Listo'});
	})
}