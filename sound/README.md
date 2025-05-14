# Ses Dosyaları Hakkında

Bu klasörde uygulamanın kullanacağı ses dosyaları bulunmaktadır:

1. `correct.mp3` - Doğru cevap verildiğinde çalınacak ses
2. `incorrect.mp3` - Yanlış cevap verildiğinde çalınacak ses
3. `background.mp3` - Arka plan müziği

## Notlar

- Ses dosyaları HTML5 Audio elementleri kullanılarak oynatılır
- Arkaplan müziği sayfa yüklendiğinde veya ilk kullanıcı etkileşiminde otomatik başlar
- Tarayıcı güvenlik önlemleri nedeniyle, ses oynatmak için kullanıcının sayfayla en az bir kez etkileşime girmesi gerekebilir
- Tüm ses dosyaları MP3 formatında olmalıdır
- Arkaplan müziği ideal olarak 1-2 dakikalık döngüsel bir parça olmalıdır 