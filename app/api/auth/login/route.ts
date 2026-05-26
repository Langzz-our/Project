import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Tetap mengambil client instance global database kita

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validasi input kosong
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // 2. Cari user berdasarkan email di Supabase
    const user = await db.user.findUnique({
      where: { email: email }
    });

    // 3. Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { message: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    // 4. Cek apakah password cocok
    // Catatan: Di aplikasi production nanti, gunakan bcrypt.compare()!
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    // 5. Jika sukses cocok, kirim data profil user ke frontend
    return NextResponse.json(
      {
        message: 'Login berhasil! Selamat datang kembali.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error saat login:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server', error: error.message },
      { status: 500 }
    );
  }
}