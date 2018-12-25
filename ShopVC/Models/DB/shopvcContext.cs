using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ShopVC.Models.DB
{
    public partial class shopvcContext : DbContext
    {
        public shopvcContext()
        {
        }

        public shopvcContext(DbContextOptions<shopvcContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CartItems> CartItems { get; set; }
        public virtual DbSet<ChiTietHd> ChiTietHd { get; set; }
        public virtual DbSet<Danhmuc> Danhmuc { get; set; }
        public virtual DbSet<HoaDon> HoaDon { get; set; }
        public virtual DbSet<Khachhang> Khachhang { get; set; }
        public virtual DbSet<KhachHangReport> KhachHangReport { get; set; }
        public virtual DbSet<SanPham> SanPham { get; set; }
        public virtual DbSet<User> User { get; set; }

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseSqlServer("Server=DESKTOP-MDNFBIN;Database=shopvc;Trusted_Connection=True;");
//            }
//        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CartItems>(entity =>
            {
                entity.HasKey(e => e.ItemsId);

                entity.Property(e => e.ItemsId)
                    .HasColumnName("ItemsID")
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.CartId)
                    .HasColumnName("CartID")
                    .HasMaxLength(100);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Idsanpham).HasColumnName("IDSanpham");

                entity.HasOne(d => d.IdsanphamNavigation)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(d => d.Idsanpham)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CartItems_SanPham");
            });

            modelBuilder.Entity<ChiTietHd>(entity =>
            {
                entity.HasKey(e => e.IdChitiet);

                entity.ToTable("ChiTiet_HD");

                entity.Property(e => e.IdChitiet)
                    .HasColumnName("idChitiet")
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.GiaSp)
                    .HasColumnName("GiaSP")
                    .HasMaxLength(100);

                entity.Property(e => e.IdHd).HasColumnName("Id_hd");

                entity.Property(e => e.IdSp).HasColumnName("Id_sp");

                entity.Property(e => e.MaVoucher)
                    .HasColumnName("Ma_Voucher")
                    .HasMaxLength(10);

                entity.Property(e => e.SoLuongDaMua).HasColumnName("SoLuong_DaMua");

                entity.Property(e => e.TinhTrangSd).HasColumnName("TinhTrang_SD");

                entity.Property(e => e.UnitPrice).HasMaxLength(100);

                entity.HasOne(d => d.IdHdNavigation)
                    .WithMany(p => p.ChiTietHd)
                    .HasForeignKey(d => d.IdHd)
                    .HasConstraintName("FK_ChiTiet_HD_HoaDon");

                entity.HasOne(d => d.IdSpNavigation)
                    .WithMany(p => p.ChiTietHd)
                    .HasForeignKey(d => d.IdSp)
                    .HasConstraintName("FK_TinhTrang_SP_SanPham");
            });

            modelBuilder.Entity<Danhmuc>(entity =>
            {
                entity.HasKey(e => e.IdDm);

                entity.Property(e => e.IdDm)
                    .HasColumnName("Id_dm")
                    .HasMaxLength(5)
                    .ValueGeneratedNever();

                entity.Property(e => e.IdDml).HasColumnName("idDML");

                entity.Property(e => e.TenDanhmuc)
                    .HasColumnName("Ten_danhmuc")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<HoaDon>(entity =>
            {
                entity.HasKey(e => e.IdHd);

                entity.Property(e => e.IdHd)
                    .HasColumnName("Id_hd")
                    .ValueGeneratedNever();

                entity.Property(e => e.GhiChu).HasMaxLength(50);

                entity.Property(e => e.IdKh).HasColumnName("Id_Kh");

                entity.Property(e => e.NgayLap).HasColumnType("datetime");

                entity.Property(e => e.TenNguoiNhan).HasMaxLength(100);

                entity.Property(e => e.TinhTrang).HasMaxLength(50);

                entity.Property(e => e.TongGiaTri).HasColumnType("money");

                entity.Property(e => e.TongSlsp).HasColumnName("TongSLSP");

                entity.HasOne(d => d.IdKhNavigation)
                    .WithMany(p => p.HoaDon)
                    .HasForeignKey(d => d.IdKh)
                    .HasConstraintName("FK_HoaDon_Khachhang");
            });

            modelBuilder.Entity<Khachhang>(entity =>
            {
                entity.HasKey(e => e.IdKh);

                entity.Property(e => e.IdKh)
                    .HasColumnName("Id_Kh")
                    .ValueGeneratedNever();

                entity.Property(e => e.Mail).HasMaxLength(100);

                entity.Property(e => e.MatkhauKhach).HasColumnName("Matkhau_Khach");

                entity.Property(e => e.TenKh).HasColumnName("Ten_Kh");
            });

            modelBuilder.Entity<KhachHangReport>(entity =>
            {
                entity.HasKey(e => e.IdReport);

                entity.Property(e => e.IdReport)
                    .HasColumnName("idReport")
                    .ValueGeneratedNever();

                entity.Property(e => e.IdHd).HasColumnName("idHD");

                entity.HasOne(d => d.IdHdNavigation)
                    .WithMany(p => p.KhachHangReport)
                    .HasForeignKey(d => d.IdHd)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_KhachHangReport_HoaDon");
            });

            modelBuilder.Entity<SanPham>(entity =>
            {
                entity.HasKey(e => e.IdSp);

                entity.Property(e => e.IdSp).HasColumnName("Id_sp");

                entity.Property(e => e.AnhSp)
                    .HasColumnName("AnhSP")
                    .HasMaxLength(50);

                entity.Property(e => e.DacDiem).HasColumnType("text");

                entity.Property(e => e.DieuKienSd)
                    .HasColumnName("DieuKienSD")
                    .HasColumnType("text");

                entity.Property(e => e.FlashDealBd)
                    .HasColumnName("FlashDeal_BD")
                    .HasColumnType("datetime");

                entity.Property(e => e.FlashDealKt)
                    .HasColumnName("FlashDeal_KT")
                    .HasColumnType("datetime");

                entity.Property(e => e.GiaFlashDeal).HasMaxLength(50);

                entity.Property(e => e.GiaSp)
                    .HasColumnName("GiaSP")
                    .HasMaxLength(100);

                entity.Property(e => e.Hinh1).HasMaxLength(50);

                entity.Property(e => e.Hinh2).HasMaxLength(50);

                entity.Property(e => e.Hinh3).HasMaxLength(50);

                entity.Property(e => e.IdCreator).HasMaxLength(50);

                entity.Property(e => e.IdDm)
                    .IsRequired()
                    .HasColumnName("Id_dm")
                    .HasMaxLength(5);

                entity.Property(e => e.KhuyenMai).HasMaxLength(50);

                entity.Property(e => e.NgayBd)
                    .HasColumnName("NgayBD")
                    .HasColumnType("datetime");

                entity.Property(e => e.NgayBdKm)
                    .HasColumnName("Ngay_BD_KM")
                    .HasColumnType("datetime");

                entity.Property(e => e.NgayKt)
                    .HasColumnName("NgayKT")
                    .HasColumnType("datetime");

                entity.Property(e => e.NgayKtKm)
                    .HasColumnName("Ngay_KT_KM")
                    .HasColumnType("datetime");

                entity.Property(e => e.PhiVanChuyen).HasColumnType("money");

                entity.Property(e => e.TenSp).HasColumnName("TenSP");

                entity.HasOne(d => d.IdDmNavigation)
                    .WithMany(p => p.SanPham)
                    .HasForeignKey(d => d.IdDm)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SanPham_Danhmuc");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.IdAdmin);

                entity.Property(e => e.IdAdmin)
                    .HasColumnName("Id_admin")
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.MatkhauAd)
                    .HasColumnName("Matkhau_ad")
                    .HasMaxLength(50);

                entity.Property(e => e.TenDnAd)
                    .HasColumnName("TenDN_AD")
                    .HasMaxLength(50);
            });
        }
    }
}
