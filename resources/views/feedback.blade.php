<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesan Kontak Baru - CIFOS</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .badge {
            display: inline-block;
            background-color: #dcfce7;
            color: #15803d;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
        }
        .info-row {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
        }
        .info-row:last-of-type {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #16a34a;
            margin-bottom: 5px;
        }
        .value {
            color: #555;
            word-wrap: break-word;
        }
        .message-box {
            background-color: #f9fafb;
            border-left: 4px solid #16a34a;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            color: #888;
            font-size: 14px;
        }
        .reply-button {
            display: inline-block;
            background-color: #16a34a;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: 600;
        }
        .reply-button:hover {
            background-color: #15803d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📨 Pesan Kontak Baru</h1>
            <span class="badge">{{ $topik }}</span>
        </div>

        <div class="info-row">
            <div class="label">Nama Pengirim:</div>
            <div class="value">{{ $nama }}</div>
        </div>

        <div class="info-row">
            <div class="label">Email:</div>
            <div class="value">
                <a href="mailto:{{ $email }}" style="color: #16a34a;">{{ $email }}</a>
            </div>
        </div>

        <div class="info-row">
            <div class="label">Kategori:</div>
            <div class="value"><strong>{{ $topik }}</strong></div>
        </div>

        <div class="info-row">
            <div class="label">Waktu Dikirim:</div>
            <div class="value">{{ $tanggal }}</div>
        </div>

        <div class="message-box">
            <div class="label">Pesan:</div>
            <div class="value" style="white-space: pre-wrap;">{{ $pesan }}</div>
        </div>

        <div style="text-align: center;">
            <a href="mailto:{{ $email }}?subject=Re: {{ $topik }}" class="reply-button">
                Balas Email
            </a>
        </div>

        <div class="footer">
            <p>Email ini dikirim otomatis dari halaman kontak CIFOS</p>
            <p style="margin-top: 5px;">© {{ date('Y') }} Ciawi Food Station. All rights reserved.</p>
        </div>
    </div>
</body>
</html>