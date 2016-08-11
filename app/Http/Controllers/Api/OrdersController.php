<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class OrdersController extends Controller
{
    public function store(Request $request){
        $method = $request->get('method');
        $items = $request->get('items');
        $hash = $request->get('hash');
        $total = $request->get('total');
        $token = $request->get('token');
        $directPaymentRequest = new \PagSeguroDirectPaymentRequest();
        $directPaymentRequest->setPaymentMode('DEFAULT'); // GATEWAY
        $directPaymentRequest->setPaymentMethod($method);

        $directPaymentRequest->setCurrency("BRL");

        foreach ($items as $key => $item){
            $directPaymentRequest->addItem("00$key",$item['name'],1,$item['price']);
        }

        $directPaymentRequest->setSender(
            'João Comprador',
            'joao@sandbox.pagseguro.com.br',
            '11',
            '56273440',
            'CPF',
            '156.009.442-76'
        );

        $directPaymentRequest->setSenderHash($hash);

        $installments = new \PagSeguroDirectPaymentInstallment([
            'quantity' => 1,
            'value' => $total
        ]);

        $sedexCode = \PagSeguroShippingType::getCodeByType('SEDEX');
        $directPaymentRequest->setShippingType($sedexCode);
        $directPaymentRequest->setShippingAddress(
            '01452002',
            'Av. Brig. Faria Lima',
            '1384',
            'apto. 114',
            'Jardim Paulistano',
            'São Paulo',
            'SP',
            'BRA'
        );

        $billingAddress = new \PagSeguroBilling(
            array(
                'postalCode' => '01452002',
                'street' => 'Av. Brig. Faria Lima',
                'number' => '1384',
                'complement' => 'apto. 114',
                'district' => 'Jardim Paulistano',
                'city' => 'São Paulo',
                'state' => 'SP',
                'country' => 'BRA'
            )
        );

        $creditCardData = new \PagSeguroCreditCardCheckout(
            array(
                'token' => $token,
                'installment' => $installments,
                'billing' => $billingAddress,
                'holder' => new \PagSeguroCreditCardHolder(
                    array(
                        'name' => 'João Comprador',
                        'birthDate' => date('01/10/1979'),
                        'areaCode' => '11',
                        'number' => '56273440',
                        'documents' => array(
                            'type' => 'CPF',
                            'value' => '156.009.442-76'
                        )
                    )
                )
            )
        );

        $directPaymentRequest->setCreditCard($creditCardData);

        try {

            $credentials = \PagSeguroConfig::getAccountCredentials(); // getApplicationCredentials()
            $response = $directPaymentRequest->register($credentials);
            \PagSeguroTransaction::class
            return [
                'success' => true,
            ];
        } catch (\PagSeguroServiceException $e) {
            return [
                'message' => $e->getMessage(),
                'success' => false
            ];
        }
    }
}
