const User = require('../models/user')
const Booking = require('../models/booking')
const Pitch = require('../models/pitch')

const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')
const { users } = require('../ultils/constant')


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, role } = req.body
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    const user = await User.findOne({ email })
    if (user)
        throw new Error('User has existed')
    else {
        const token = makeToken()
        const emailedited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailedited, password, firstname, lastname, role
        })
        if (newUser) {
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>
                    body {
                        font-family: 'Helvetica', Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
      
                    .container {
                        max-width: 560px;
                        margin: 0 auto;
                        font-family: 'Helvetica', Arial, sans-serif;
                    }
      
                    .header {
                        background-color:#ffffff;
                        color: #fff;
                        text-align: center;
                        padding: 20px;
                    }
      
                    .logo img {
                        max-width: 100%;
                        height: auto;
                    }
      
                    .content {
                        background-color: #ffffff;
                        color: #353740;
                        padding: 40px 20px;
                        text-align: left;
                        line-height: 1.5;
                    }
      
                    h1 {
                        color: #202123;
                        font-size: 32px;
                        line-height: 40px;
                        margin: 0 0 20px;
                    }
                    .code{
                      font-size: 16px;
                      line-height: 24px;
                      margin: 0 0 24px;
                      text-align: center; 
                    }
                    p {
                      font-size: 16px;
                      line-height: 24px;
                      margin: 0 0 24px; 
                  }
      
                    .cta-button {
                        display: inline-block;
                        text-decoration: none;
                        background: #10a37f;
                        border-radius: 3px;
                        color: white;
                        font-size: 16px;
                        line-height: 24px;
                        font-weight: 400;
                        padding: 12px 20px 11px;
                        margin: 0px;
                    }
      
                    .footer {
                        background: #ffffff;
                        color: #6e6e80;
                        padding: 0 20px 20px;
                        font-size: 13px;
                        line-height: 1.4;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <center>
                    <table class="container" style="width: 100%; border-collapse: collapse !important;">
                        <tr>
                            <td class="header">
                                <img src="https://res.cloudinary.com/dmj8tbay1/image/upload/v1701228568/logo_ykataq.png" width="200" height="80" alt="BookingPitches Logo">
                            </td>
                        </tr>
                        <tr>
                            <td class="content">
                                <h1>Verify your email address</h1>
                                <p>
                                    To continue setting up your BookingPitches account, please verify that this is your email address.
                                </p>
                                <p class"code">
                                    ${token}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td class="footer">
                                <p>
                                    This link will expire in 1 minutes. If you did not make this request, please disregard this email.
                                    For help, contact us through our <a href="" target="_blank">FAQ</a>.
                                </p>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
            </html>
          `
            sendMail({ email, html, subject: 'Complete Register Debug Boy' })
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailedited })
        }, [600000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to active account' : 'Something went wrong, please try again123123'
        })
    }
})
const finalRegister = asyncHandler(async (req, res) => {
    //const cookie = req.cookies
    const { token } = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register is succesfully. Please go login' : 'Something went wrong, please try again'
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })

    //refresh token => cấp mới accesstoken .
    //access token => xác thực người dùng , phân quyền người dùng.
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        //tạo accesstoken
        const accessToken = generateAccessToken(response._id, role)
        //tạo refreshtoken
        const newrefreshToken = generateRefreshToken(response._id)
        // lưu refreshtoken vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newrefreshToken }, { new: true })
        // lưu refresh token vào cookie
        res.cookie('refreshToken', newrefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })

    } else {
        throw new Error('Invalid credentials')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // lấy token từ cookies
    const cookie = req.cookies
    // check có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookie')
    // check token còn hạn hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    // check xem token có khớp với token đã lưu trong db 
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })

})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // xóa refresh token ở cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        sucess: true,
        mes: 'Logout is done'
    })
})
//client gửi mail
//server check mail ==> gửi mail + link (password change token)
//client check mail
//client gửi api kèm token
//check token có giống với server gửi 0
//change password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Please click to this link to reset your password. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: "Forgot password"
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Please check your email' : 'Somthing went wrong , try again'
    })
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Update password' : 'Something went wrong'
    })
})
const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // tách các trường đặc biệt ra khỏi query
    const exlcludeFields = ['limit', 'sort', 'page', 'fields']
    exlcludeFields.forEach(el => delete queries[el])

    //Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formartedQueries = JSON.parse(queryString)
    // formartedQueries['$or'] = [
    //     { role: { $regex: queries.q, $options: 'i' } }
    // ]
    // Filtering
    // regex: tìm từ bắt đầu bằng chữ truyền vào
    // options: 'i' không phân biệt viết hoa viết thường 
    // doc: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    if (queries?.name) formartedQueries.name = { $regex: queries.name, $options: 'i' }

    if (req.query.q) {
        delete formartedQueries.q
        formartedQueries['$or'] = [
            { firstname: { $regex: queries.q, $options: 'i' } },
            { lastname: { $regex: queries.q, $options: 'i' } },
            { email: { $regex: queries.q, $options: 'i' } }
        ]
    }
    let queryCommand = User.find(formartedQueries)

    //Sorting 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    // Fields litmiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Pagination
    //limit : số object lấy về 1 lần gọi API
    //skip 2 (bỏ qua 2 cái đầu)
    // +2 => 2 
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_USERS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    // Executed query
    // Số lượng sân thỏa điều kiện 
    queryCommand.then(async (response) => {
        const counts = await User.find(formartedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Can not get users'

        })
    }).catch((err) => {
        if (err) throw new Error(err, message)
    })

})

const deleteUsers = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} has been deleted ` : 'No user deleted'
    })
})

const updateUsers = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { firstname, lastname, email } = req.body
    const data = { firstname, lastname, email }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Can not update'
    })
})
const updateUsersByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Can not update'
    })
})
const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        createUsers: response ? response : 'Can not create list of user'
    })
})


const updateOrder = asyncHandler(async (req, res) => {
    try {
        const { pitchId, bookedDate, shift } = req.body;

        // Kiểm tra bookedDate
        const currentDate = new Date();
        if (new Date(bookedDate) < currentDate) {
            return res.status(400).json({
                success: false,
                message: "Ngày đặt sân phải bằng hoặc lớn hơn ngày hiện tại.",
            });
        }

        // Kiểm tra trong trường pitches của model booking
        const existingBooking = await Booking.findOne({
            "pitches.pitch": pitchId,
            "pitches.bookedDate": bookedDate,
        });

        if (existingBooking) {
            // Kiểm tra trường shift
            const foundShift = existingBooking.pitches.find(
                (pitch) =>
                    pitch.pitch.toString() === pitchId &&
                    pitch.shift.some((s) => shift.includes(s))
            );

            if (foundShift) {
                return res.status(400).json({
                    success: false,
                    message: "Sân đã được đặt vào thời gian và ca sân đã chọn.",
                });
            }
        }

        // Nếu không có lỗi, thêm vào trường order của model user
        const userId = req.user._id; // Lấy user ID từ token hoặc middleware xác thực
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { order: { pitch: pitchId, bookedDate, shift } } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Đặt sân thành công.",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
        });
    }
});

const BookingPitch = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pitchId, bookedDate, shifts, hours, total } = req.body;
    // check hour
    if (
        !pitchId ||
        !bookedDate ||
        !Array.isArray(shifts) ||
        shifts.length === 0 ||
        !Array.isArray(hours) ||
        hours.length !== shifts.length
    )
        throw new Error("Missing input");
    const currentDate = new Date();
    // await Booking.deleteMany({ bookedDate: { $lt: currentDate } });

    const bookingDate = new Date(bookedDate);

    if (
        bookingDate < currentDate.setHours(0, 0, 0, 0) ||
        (bookingDate.getTime() === currentDate.setHours(0, 0, 0, 0) &&
            hours.some((hour) => hour <= new Date().getHours()))
    ) {
        return res.status(400).json({
            success: false,
            message: "Cannot book a pitch for a past date or time.",
        });
    }

    const existingBooking = await Booking.findOne({
        pitch: pitchId,
        bookedDate: bookedDate,
        shift: { $in: shifts },
    });
    if (existingBooking) {
        // Kiểm tra trường shift
        return res.status(400).json({
            success: false,
            message: `This pitch already booked for the selected shift(s) ${shifts}}`,
        });
    } else {
        const pitchInfo = await Pitch.findById(pitchId);
        const bookingDataArray = shifts.map((shift, index) => ({
            bookingBy: _id,
            pitch: pitchId,
            bookedDate: bookedDate,
            shift: shift,
            hour: hours[index], // Gán giá trị giờ tương ứng với mỗi shift
            total: total,
            owner: pitchInfo.owner,
        }));
        const response = await Promise.all(
            bookingDataArray.map((data) => Booking.create(data))
        );
        return res.status(200).json({
            success: response.every(Boolean),
            message: response.every(Boolean)
                ? "Booked"
                : "Something went wrong with one or more bookings.",
        });
    }
});

const updateWishlist = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { _id } = req.user
    const user = await User.findById(_id)
    const alreadyInWishlist = user.wishlist?.find(el => el.toString() === pid)
    if (alreadyInWishlist) {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $pull: { wishlist: pid }
            },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            message: response ? "Update your wishlist" : "Failed to update wishlist",
        });
    }
    else {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: { wishlist: pid }
            },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            message: response ? "Update your wishlist" : "Failed to update wishlist",
        });
    }
})

const getWishListById = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const user = await User.findById(uid)
        .select('-refreshToken -password')
        .populate('wishlist', 'title thumb price category')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})


module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUsers,
    updateUsers,
    updateUsersByAdmin,
    finalRegister,
    createUsers,
    updateOrder,
    BookingPitch,
    updateWishlist,
    getWishListById
}