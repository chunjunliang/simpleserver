项目已部署到 Render：https://create-new-item.onrender.com

## 通过 API 上传 JSON 文件

### 方法一：使用 curl 命令

```bash
curl -X POST https://create-new-item.onrender.com/upload \
  -F "jsonFile=@your-file.json"
```

### 方法二：使用 JavaScript fetch

```javascript
const formData = new FormData();
formData.append('jsonFile', fileInput.files[0]);

fetch('https://create-new-item.onrender.com/upload', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    console.log('上传成功:', data);
})
.catch(error => {
    console.error('上传失败:', error);
});
```

### 方法三：使用 Python requests

```python
import requests

url = 'https://create-new-item.onrender.com/upload'
files = {'jsonFile': open('your-file.json', 'rb')}

response = requests.post(url, files=files)
print(response.json())
```

### 方法四：使用 Postman

1. 打开 Postman
2. 选择 POST 方法
3. 输入 URL：`https://create-new-item.onrender.com/upload`
4. 在 Body 选择 `form-data`
5. 添加 key：`jsonFile`，类型选择 `File`
6. 选择要上传的 JSON 文件
7. 点击 Send

## API 响应格式

成功响应：
```json
{
    "message": "文件上传成功",
    "filename": "jsonFile-1759980717819-352707100.json",
    "originalName": "your-file.json",
    "size": 487,
    "path": "uploads/jsonFile-1759980717819-352707100.json"
}
```

错误响应：
```json
{
    "error": "没有上传文件"
}
```

## 注意事项

1. 文件格式：仅支持 `.json`
2. 文件大小：限制 10MB
3. 内容校验：必须是有效 JSON
4. 字段名：必须为 `jsonFile`

## 其他相关 API

- 获取文件列表：`GET https://create-new-item.onrender.com/files`
- 下载文件：`GET https://create-new-item.onrender.com/download/{filename}`
- 删除文件：`DELETE https://create-new-item.onrender.com/files/{filename}`

可直接使用以上任一方法上传 JSON 文件。