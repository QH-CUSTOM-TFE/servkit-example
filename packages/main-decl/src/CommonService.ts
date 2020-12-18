import { ServService, ServEventer, anno, ServAPIArgs, ServAPIRetn, API_UNSUPPORT } from 'servkit';

@anno.decl({
    id: 'main.service.common',
    version: '1.0.0',
})
export class CommonService extends ServService {
    @anno.decl.notify()
    message(args: ServAPIArgs<string>): ServAPIRetn {
        return API_UNSUPPORT();
    }

    @anno.decl.api({
        timeout: -1,
    })
    confirm(args: ServAPIArgs<string>): ServAPIRetn {
        return API_UNSUPPORT();
    }
}