import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { slug: params.slug },
      include: { category: { select: { name: true, slug: true } } },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error" },
      { status: 500 }
    );
  }
}