import { Link } from "react-router-dom";
function SendOk() {
    return (
        <div style={{ margin: '0 auto' }} className="flex items-start justify-center">
            <div className='backgoround-niso-from niso-box-titles bg-white'>
                <h2 className="olk">Câu trả lời của bạn đã được ghi nhận ! nhấn vào <Link to="/auth/docs/home" style={{color: '#ae8f3d'}} className="font-bold">đây</Link> để quay lại trang chủ</h2>
            </div>
        </div>
    )
}

export default SendOk;