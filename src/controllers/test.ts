import { JsonController, Get } from 'routing-controllers'

@JsonController('/test')
export class TestController {

  @Get('/')
  get() {
    return "这是测试"
  }
}