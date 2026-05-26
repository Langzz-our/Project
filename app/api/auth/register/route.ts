import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Path disesuaikan karena posisi file di app/api/auth/register

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Semua data (Nama, Email, Password) wajib diisi!' },
        { status: 400 }
      );
    }

    // Cek user di database
    const userExists = await db.user.findUnique({
      where: { email: email }
    });

    if (userExists) {
      return NextResponse.json(
        { message: 'Email ini sudah terdaftar.' },
        { status: 400 }
      );
    }

    // Simpan ke Supabase
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password,
        role: 'CUSTOMER'
      }
    });

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil!', 
        user: { id: newUser.id, name: newUser.name, email: newUser.email } 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server', error: error.message },
      { status: 500 }
    );
  }
}