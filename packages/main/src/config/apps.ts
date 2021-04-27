import { SappInfo, ESappType } from 'servkit';

const infos: SappInfo[] = [
    {
        id: 'serv0',
        name: '场景小程序',
        version: '1.0.0',
        url: 'serv0.html?version=${version}',
        options: {
            useTerminalId: 'com.servkit.example.serv',
        }
    },
    {
        id: 'baidu',
        name: '百度',
        version: '1.0.0',
        url: 'https://www.baidu.com',
        type: ESappType.IFRAME,
        options: {
            isPlainPage: true,
        }
    },
];

export function getAppList() {
    return infos;
}

export function getAppInfo(id: string): SappInfo | undefined {
    return infos.filter((item) => item.id === id)[0];
}
