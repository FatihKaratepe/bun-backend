## Düzeltilen Sorunlar

1. **`schema.prisma` senkronizasyonu** — `company.prisma`'daki `description` alanı merged schema'da eksikti. Merge script tekrar çalıştırılarak düzeltildi.
2. **Address `billingType` default değeri** — `isBilling: false` olsa bile `@default(INDIVIDUAL)` atanıyordu. Default kaldırıldı, artık sadece fatura adresi olarak işaretlendiğinde set edilecek.

## Eklenen E-Ticaret Modelleri

| Model | Dosya | Açıklama |
|-------|-------|----------|
| **Category** | `category.prisma` | Hiyerarşik kategori yapısı (parent/children self-relation), slug, sıralama |
| **Brand** | `brand.prisma` | Marka yönetimi, slug, logo |
| **Product** | `product.prisma` | Ana ürün modeli — fiyat, stok, KDV oranı, ağırlık/boyut, SEO meta alanları |
| **ProductVariant** | `product-variant.prisma` | Varyant desteği (beden, renk vs.), JSON `attributes` ile esnek özellikler |
| **ProductImage** | `product-image.prisma` | Ürün görselleri, sıralama, primary flag |
| **Review** | `review.prisma` | Ürün yorumları, puan, onay mekanizması, kullanıcı başına tek yorum |
| **Cart / CartItem** | `cart.prisma` | Sepet yönetimi, varyant destekli, kullanıcı başına tek sepet |
| **Order / OrderItem** | `order.prisma` | Sipariş yönetimi — kargo/fatura adresi, kupon, kargo takip, 8 aşamalı durum |
| **Payment** | `payment.prisma` | Ödeme kaydı — kredi kartı, havale, kapıda ödeme desteği |
| **Coupon** | `coupon.prisma` | Kupon/indirim — yüzde/sabit tutar, minimum sipariş, kullanım limiti |
| **WishlistItem** | `wishlist.prisma` | Favori listesi, kullanıcı+ürün unique constraint |

Mevcut **User** ve **Address** modelleri de yeni relation'larla güncellendi (reviews, orders, cart, wishlist, shippingOrders, billingOrders).
