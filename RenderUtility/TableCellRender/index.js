import { Tooltip, Button, Icon, Popconfirm, Tag } from "ant-design-vue"
import moment from "moment"
import "./index.scss"

/**
 * @param {String} target target param
 * @param {String} type current render type
 * @param {Function} callback if a button, trigger onclick event
 * @param {Any} extra extra data to render cell, depends on type
 */
export function CellRender (
  target,
  type,
  callback,
  {
    style,
    label,
    icon,
    btnType,
    h,
    row,
    list,
    separator,
    confirmCallbak,
    cancelCallBack,
    timeFormat = "YYYY-MM-DD HH:mm:ss"
  }
) {
  /**
   * attention: 直接调用时，将 h 和 row 元数据封装在 extra 内进行传递
   * case type is 'list', list as metadata for loop, {value, label, color}
   */
  // 判断是否在 extra 内，如果没有，则在 arguments 内获取 h
  if (!h) {
    h = [...arguments].slice(-2, -1)[0]
  }
  if (!row) {
    row = [...arguments].slice(-1)[0].row
  }
  let tpl = ""
  switch (type) {
    case "number":
      const num = String(row[target]).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        separator ? separator : ","
      )
      tpl = <b style="font-size: 12px;">{num}</b>
      break
    case "datetime":
      tpl = (
        <span>
          {row[target] ? moment(row[target]).format(timeFormat) : "-"}
        </span>
      )
      break
    case "timestamp":
      tpl = (
        <span>
          {row[target] ? moment.unix(row[target]).format(timeFormat) : "-"}
        </span>
      )
      break
    case "btn":
      tpl = (
        <a-button
          type={btnType ? btnType : "primary"}
          size="small"
          icon={icon}
          style={`font-size: 12px; ${style ? style : ""}`}
          onClick={() => {
            callback && callback()
          }}
        >
          {label ? label : ""}
        </a-button>
      )
      break
    // edit button case
    case "btn-edit":
      tpl = (
        <a-button
          type="primary"
          size="small"
          icon="edit"
          style={`font-size: 12px; ${style ? style : ""}`}
          onClick={() => {
            callback && callback()
          }}
        >
          {label ? label : ""}
        </a-button>
      )
      break
    // delete button case
    case "btn-delete":
      tpl = (
        <Popconfirm
          title="您确认删除这条记录吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            confirmCallbak && confirmCallbak()
          }}
          onCancel={() => {
            cancelCallBack && cancelCallBack()
          }}
        >
          <Icon slot="icon" type="question-circle-o" style="color: red" />
          <Button icon="delete" size="small" type="danger">
            {label ? label : ""}
          </Button>
        </Popconfirm>
      )
      break
    // 包含复制功能
    case "btn-copy":
      tpl = (
        <div>
          <Tooltip
            placement="right"
            title="复制"
            trigger="hover"
            overlayStyle={{ fontSize: "12px" }}
          >
            <Button
              class="cell-copy-btn"
              type="link"
              onClick={() => {
                callback && callback()
              }}
            >
              {row[target]}
            </Button>
          </Tooltip>
        </div>
      )
      break
    case "string":
      tpl = <span>{row[target] || "-"}</span>
      break
    case "list":
      const listItem = list.find(item => {
        return item.value === row[target]
      })
      tpl = <span>{listItem.label ? listItem.label : "-"}</span>
      break
    case "tag-list":
      const tagListItem = list.find(item => {
        return item.value === row[target]
      })
      tpl = (
        <Tag
          color={tagListItem && tagListItem.color ? tagListItem.color : "blue"}
        >
          {tagListItem && tagListItem.label ? tagListItem.label : "-"}
        </Tag>
      )
      break
    default:
      break
  }
  return tpl
}

// 生成唯一标识
export function generateUUID () {
  let d = Number(new Date())
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now()
  }
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
