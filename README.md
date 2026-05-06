## How to install ollama in Ubuntu:

`curl -fsSL https://ollama.com/install.sh | sh`

## How to set ollama runs as a service

`systemctl edit ollama` to config
`systemctl enable ollama` to enable ollama as a service
`systemctl start ollama` to start it
`systemctl status ollama` to check status

## How to load new model

`ollama pull qwen2.5:7b`

### To use Modelfile

- Create a Modelfile with bellow content:

```
    FROM qwen2.5:7b

    # Cấu hình tham số để phản hồi tự nhiên nhưng chính xác cho việc đặt chỗ
    PARAMETER temperature 0.7
    PARAMETER top_p 0.9

    # System Prompt: Kết hợp chức năng Dịch (Giai đoạn 1) và Concierge (Giai đoạn 2)
    SYSTEM """
    Bạn là Trợ lý AI Concierge thông minh của hệ thống 'Không giới hạn ngôn ngữ'.
    Nhiệm vụ:
    1. Giai đoạn 1: Dịch thuật hội thoại tự nhiên giữa các ngôn ngữ, ưu tiên hiểu đúng ngữ cảnh tiếng Việt.
    2. Giai đoạn 2: Hỗ trợ tìm kiếm Merchant (nhà hàng, quán ăn) và thực hiện các tác vụ đặt chỗ (Booking).
    3. Quy tắc an toàn: Trước khi thực hiện thanh toán hoặc đặt chỗ, PHẢI yêu cầu người dùng xác nhận thông tin.
    4. Phong cách: Thân thiện, ngắn gọn, phản hồi dưới 1.5 giây.
    """
```

- Run bellow command to load:

`ollama create ai-concierge -f Modelfile`

## How to use:
