<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestController extends Controller
{
    public function takeReqData(Request $request)
    {
        $task = $request->input('task');
        $status = $request->input('status');
        $path = $request->path();
        $completeURL = $request->fullUrl();
        $withoutParams = $request->url();
        $domain = $request->host();
        $domainWithPORT = $request->httpHost();
        $scheme_http_post = $request->schemeAndHttpHost();
        $validator = Validator::make($request->all(), [
            'task' => ['required', 'string', 'max:50'],
            'status' => ['required', 'in:PENDENTE,EM_ANDAMENTO,CONCLUIDA'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'erro' => $validator->errors(),
            ]);
        }

        return response()->json([
            'task' => $task,
            'status' => $status,
            'caminho-interno-da-url' => $path,
            'caminho-sem-parametros' => $withoutParams,
            'url-completa' => $completeURL,
            'url-scheme-post' => $scheme_http_post,
            'dominio' => $domain,
            'dominio-com-PORTA' => $domainWithPORT,
            'estrutura-completa-da-request' => $request,
        ]);
    }
}
