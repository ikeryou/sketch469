import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Point } from "../libs/point";
import { MousePointer } from "../core/mousePointer";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _tgSVG: SVGElement
  private _tgPath: SVGPathElement
  private _clipID: string
  private _basePoint: Array<Point> = []
  private _bg: HTMLElement

  constructor(opt:any) {
    super(opt)

    this._bg = document.querySelector('.l-main.-bg') as HTMLElement

    this._clipID = 'myClipPath0'

    this._tgSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this._tgSVG.classList.add('js-tgSVG')

    const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
    this._tgSVG.appendChild(clip)
    clip.setAttributeNS(null, 'clipPathUnits', 'objectBoundingBox')
    clip.setAttributeNS(null, 'id', this._clipID)

    this._tgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    clip.appendChild(this._tgPath)

    Tween.set(this.el, {
      clipPath: 'url(#' + this._clipID + ')',
    })
    document.body.appendChild(this._tgSVG)
  }


  //
  private _getPathStr(): string {
    const mx = MousePointer.instance.normal.x
    const my = MousePointer.instance.normal.y

    Tween.set(this.el, {
      opacity: mx < -0.9 ? 0 : 1,
    })

    Tween.set(this._bg, {
      scale: Util.map(mx, 1, 0.9, -1, 1)
    })

    const min = 0.5

    this._basePoint[0] = new Point(
      Util.map(mx, 0 + min, 0, -1, 1),
      Util.map(mx, 0 + min, 0, -1, 1),
    )

    this._basePoint[1] = new Point(
      Util.map(mx, 1 - min, 1, -1, 1),
      Util.map(mx, 0 + min, 0, -1, 1),
    )

    this._basePoint[2] = new Point(
      Util.map(mx, 1 - min, 1, -1, 1),
      Util.map(mx, 1 - min, 1, -1, 1)
    )

    this._basePoint[3] = new Point(
      Util.map(mx, 0 + min, 0, -1, 1),
      Util.map(mx, 1 - min, 1, -1, 1)
    )

    let d = ''
    const n = Util.map(my, 0.01, 0.03, -1, 1)
    const it = Util.map(my, 5, 50, -1, 1)
    let i = 0

    // 上
    for(i = 0; i < it; i++) {
      const nx = Util.range(n) * 0
      const ny = Util.range(n)
      if(i == 0) {
        d += 'M ' + (this._basePoint[0].x + nx) + ' ' + (this._basePoint[0].y + ny) + ' '
      } else {
        const rate = Util.map(i, 0, 1, 0, it - 2)
        const x = Util.mix(this._basePoint[0].x, this._basePoint[1].x, rate)
        const y = this._basePoint[0].y
        d += 'L ' + (x + nx) + ' ' + (y + ny) + ' '
      }
    }

    // 右
    for(i = 0; i < it; i++) {
      const nx = Util.range(n)
      const ny = Util.range(n) * 0
      const rate = Util.map(i, 0, 1, 0, it - 2)
      const x = this._basePoint[1].x
      const y = Util.mix(this._basePoint[1].y, this._basePoint[2].y, rate)
      d += 'L ' + (x + nx) + ' ' + (y + ny) + ' '
    }

    // 下
    for(i = 0; i < it; i++) {
      const nx = Util.range(n) * 0
      const ny = Util.range(n)
      const rate = Util.map(i, 0, 1, 0, it - 2)
      const x = Util.mix(this._basePoint[2].x, this._basePoint[3].x, rate)
      const y = this._basePoint[2].y
      d += 'L ' + (x + nx) + ' ' + (y + ny) + ' '
    }

    // 左
    for(i = 0; i < it; i++) {
      const nx = Util.range(n)
      const ny = Util.range(n) * 0
      const rate = Util.map(i, 0, 1, 0, it - 2)
      const x = this._basePoint[3].x
      const y = Util.mix(this._basePoint[3].y, this._basePoint[0].y, rate)
      d += 'L ' + (x + nx) + ' ' + (y + ny) + ' '
    }

    return d
  }


  protected _update():void {
    super._update()

    const d = this._getPathStr()
    this._tgPath.setAttributeNS(null, 'd', d)
  }

}