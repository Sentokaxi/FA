import React from 'react'
import dayjs from 'dayjs'
import { NavBar, Button, Ellipsis, Avatar } from 'antd-mobile'
import { MailFill } from 'antd-mobile-icons'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'

import styles from './style.module.scss'
import { ReactComponent as IconCalendar } from '../../../assests/imgs/calendar.svg'
import { FollowStatus, IUser } from '@/libs/types'
import { userStore } from '@/store/userStore'

interface Props {
  user: IUser
  onFocus: () => void
}

export default function UserHeader({ user, onFocus }: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const backArrow = (
    <div className={styles.icon}>
      <ArrowLeftOutlined />
    </div>
  )

  const back = () => {
    navigate(-1)
  }

  const right =
    params.account !== userStore.user.account ? (
      <div className={styles.icon} onClick={() => {
        navigate(`/message/${params.account}`)
      }}>
        <MailFill />
      </div>
    ) : null

  return (
    <React.Fragment>
      <NavBar
        style={{
          backgroundImage: `url(${user?.banner})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgb(207, 217, 222)'
        }}
        className={styles.header}
        backArrow={backArrow}
        right={right}
        onBack={back}
      />
      <div className={styles.info}>
        <Avatar src={user?.avatar} className={styles.avatar} />
        {!!user.focusStatus && userStore.user.account !== params.account ? (
          <Button
            className={classNames(styles.focus, {
              [styles.btn_following]: user.focusStatus && [FollowStatus.HasFollow, FollowStatus.HasEachFollowed].includes(user.focusStatus)
            })}
            onClick={onFocus}
            shape="rounded"
            color="primary"
          >
            {
              user.focusStatus === FollowStatus.HasFollow ? '????????????' :
                user.focusStatus === FollowStatus.HasBeFollowed ? '??????' :
                  user.focusStatus === FollowStatus.HasEachFollowed ? '?????????' :
                    user.focusStatus === FollowStatus.NoFollow ? '??????' : ''
            }
          </Button>
        ) : (
          <Button
            className={styles.focus}
            onClick={() => {
              navigate('/revise')
            }}
            shape="rounded"
            color="primary"
          >??????????????????</Button>
        )}

        <div className={styles.name}>{user?.nickname}</div>
        <div className={styles.account_info}>
          <span>{'@' + user?.account}</span>
          <IconCalendar />
          <span>{dayjs(user?.createAt).format('YYYY/MM/DD') + '??????'}</span>
        </div>
        <Ellipsis
          className={styles.account_intro}
          direction="end"
          rows={2}
          content={user?.bio || '??????????????????'}
          expandText="??????"
          collapseText="??????"
        />
        <div
          className={styles.account_follow}
          onClick={() => {
            navigate(`/focus/${user?.account}`)
          }}
        >
          <span className={styles.follow_num}>{user?.focuses}</span>
          <span>????????????</span>
          <span className={styles.follow_num}>{user?.followers}</span>
          <span>?????????</span>
        </div>
      </div>
    </React.Fragment>
  )
}
