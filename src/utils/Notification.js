import { notification } from 'antd'

// notification.config({
//   placement: 'center',
// });

const getNotificationStyle = type => {
    return {
      success: {
        color: 'rgba(0, 0, 0, 0.65)',
        border: '1px solid #B7EB8F',
        backgroundColor: '#F6FFED'
      },
      warning: {
        color: 'rgba(0, 0, 0, 0.65)',
        border: '1px solid #FFE58F',
        backgroundColor: '#FFFBE6',
        
      },
      error: {
        color: 'rgba(0, 0, 0, 0.65)',
        border: '1px solid #FFA39E',
        backgroundColor: '#FFF1F0',
        
      },
      info: {
        color: 'rgba(0, 0, 0, 0.65)',
        border: '1px solid #91D5FF',
        backgroundColor: '#E6F7FF'
      }
    }[type]
  }
  
  
  export const CustomNotification =( type, error, duration = 2 )=> {
    
    notification[type]({
      message: error ? error: "Login Successfully",
      // style: getNotificationStyle(type),
      style: {
        ...getNotificationStyle(type),
        // left: "50",
        // bottom: "50",
        // marginRight: "30",
        // transform:" translate(-50%, -50%)"
        marginRight:"30pc"
      },
      duration: duration,
    })
  }
