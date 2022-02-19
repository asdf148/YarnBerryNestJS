import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CustomController } from '../global/customController';
import { FailResponseDTO } from '../dto/failResponse.dto';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { multerDiskOptions } from '../global/multer.options';
import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { Item } from './entity/item.entity';
import { ItemService } from './item.service';

@Controller('item')
@ApiTags('게시글 API')
export class ItemController extends CustomController {
  constructor(private readonly itemService: ItemService) {
    super();
  }

  @Get('/')
  @ApiOperation({
    summary: '게시글 리스트 가져오기',
    description: '아이템 전부 찾기',
  })
  @ApiOkResponse({
    description: '아이템 전부 찾기 성공',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: '아이템 전부 찾기 실패',
    type: FailResponseDTO,
  })
  async getItems(
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: Item[] = await this.itemService.getItems();

      return this.returnSuccessResponseWithJSON<Item[]>(
        'GetItems Success',
        null,
        result,
        res,
        HttpStatus.OK,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'GetItems Fail',
        e.message,
      );
    }
  }

  @Get('detail/:itemId')
  @ApiOperation({
    summary: '게시글 하나 가져오기',
    description: '아이템 하나 찾기',
  })
  @ApiOkResponse({
    description: '아이템 하나 찾기 성공',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: '아이템 하나 찾기 실패',
    type: FailResponseDTO,
  })
  async getItem(
    @Param('itemId') itemId: string,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: Item = await this.itemService.getItem(itemId);

      return this.returnSuccessResponseWithJSON<Item>(
        'GetItem Success',
        null,
        result,
        res,
        HttpStatus.OK,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'GetItem Fail',
        e.message,
      );
    }
  }

  @Post('/:userId')
  @ApiOperation({
    summary: '게시글 작성',
    description: '아이템 생성',
  })
  @ApiCreatedResponse({
    description: '아이템 생성 성공',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: '아이템 생성 실패',
    type: FailResponseDTO,
  })
  @UseInterceptors(FileInterceptor('file', multerDiskOptions))
  async createItem(
    @UploadedFile() img: Express.Multer.File,
    @Param('userId') userId: string,
    @Body() createItem: CreateOrModifyItem,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: string = await this.itemService.createItem(
        userId,
        createItem,
        img,
      );

      return this.returnSuccessResponseWithJSON<string>(
        'CreateItem Success',
        result,
        null,
        res,
        HttpStatus.OK,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'CreateItem Fail',
        e.message,
      );
    }
  }

  @Put('/:itemId')
  @ApiOperation({
    summary: '게시글 수정',
    description: '아이템 수정',
  })
  @ApiCreatedResponse({
    description: '아이템 수정 성공',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: '아이템 수정 실패',
    type: FailResponseDTO,
  })
  @UseInterceptors(FileInterceptor('file', multerDiskOptions))
  async modifyItem(
    @UploadedFile() img: Express.Multer.File,
    @Param('itemId') itemId: string,
    @Body() modifyItem: CreateOrModifyItem,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: string = await this.itemService.modifyItem(
        itemId,
        modifyItem,
        img,
      );

      return this.returnSuccessResponseWithJSON<string>(
        'ModifyItem Success',
        result,
        null,
        res,
        HttpStatus.OK,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'ModifyItem Fail',
        e.message,
      );
    }
  }

  @Delete('/?')
  @ApiOperation({
    summary: '게시글 삭제',
    description: '아이템 삭제',
  })
  @ApiCreatedResponse({
    description: '아이템 삭제 성공',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: '아이템 삭제 실패',
    type: FailResponseDTO,
  })
  async deleteItem(
    @Query('userId') userId: string,
    @Query('itemId') itemId: string,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: string = await this.itemService.deleteItem(userId, itemId);

      return this.returnSuccessResponseWithJSON<string>(
        'DeleteItem Success',
        result,
        null,
        res,
        HttpStatus.OK,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'DeleteItem Fail',
        e.message,
      );
    }
  }
}
