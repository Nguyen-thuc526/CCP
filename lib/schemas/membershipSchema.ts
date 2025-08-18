import * as Yup from 'yup';

export const membershipSchema = Yup.object({
   memberShipName: Yup.string().required('Tên gói không được để trống'),
   rank: Yup.number()
      .min(1, 'Rank phải lớn hơn 0')
      .required('Vui lòng nhập cấp bậc'),
   discountCourse: Yup.number()
      .min(1, 'Giảm giá khóa học phải lớn hơn 0')
      .max(100, 'Không được lớn hơn 100')
      .required('Vui lòng nhập giảm giá khóa học (%)'),
   discountBooking: Yup.number()
      .min(1, 'Giảm giá đặt lịch phải lớn hơn 0')
      .max(100, 'Không được lớn hơn 100')
      .required('Vui lòng nhập giảm giá đặt lịch (%)'),
   price: Yup.number()
      .min(1, 'Giá phải lớn hơn 0')
      .required('Vui lòng nhập giá'),
   expiryDate: Yup.number()
      .min(1, 'Thời hạn phải lớn hơn 0')
      .required('Vui lòng nhập thời hạn (ngày)'),
});

export const membershipEditSchema = Yup.object({
   memberShipName: Yup.string().required('Tên gói không được bỏ trống'),
   price: Yup.number()
      .min(1, 'Giá phải lớn hơn 0')
      .required('Vui lòng nhập giá'),
   expiryDate: Yup.number()
      .min(1, 'Phải lớn hơn 0')
      .required('Vui lòng nhập số ngày hiệu lực'),
   discountCourse: Yup.number()
      .min(1, 'Giảm giá khóa học phải lớn hơn 0')
      .max(100, 'Không được lớn hơn 100')
      .required('Vui lòng nhập giảm giá khóa học'),
   discountBooking: Yup.number()
      .min(1, 'Giảm giá đặt lịch phải lớn hơn 0')
      .max(100, 'Không được lớn hơn 100')
      .required('Vui lòng nhập giảm giá đặt lịch'),
   rank: Yup.number()
      .min(1, 'Hạng phải lớn hơn 0')
      .required('Vui lòng nhập hạng'),
});
