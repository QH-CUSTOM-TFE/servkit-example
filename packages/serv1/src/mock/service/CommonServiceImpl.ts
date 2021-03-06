import { CommonService } from 'servkit-example-main-decl';
import { anno, ServAPIArgs, ServAPIRetn, API_SUCCEED, DeferredUtil } from 'servkit';
import message from 'antd/lib/message';
import 'antd/lib/message/style/css';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style/css';

@anno.impl()
export class CommonServiceImpl extends CommonService {
    message(args: ServAPIArgs<string>): ServAPIRetn {
        message.success(args);
        return API_SUCCEED();
    }

    confirm(args: ServAPIArgs<string>): ServAPIRetn<boolean> {
        const deffered = DeferredUtil.create<boolean>();
        Modal.confirm({
            title: '确认',
            content: args,
            onCancel: () => {
                deffered.resolve(false);
            },
            onOk: () => {
                deffered.resolve(true);
            }
        })
        return deffered;
    }
}