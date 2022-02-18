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
import { Response } from 'express';
import { FailResponseDTO } from '../dto/failResponse.dto';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { multerDiskOptions } from '../global/multer.options';
import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { Item } from './entity/item.entity';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('/')
  async getItems(
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: Item[] = await this.itemService.getItems();

      const response: SuccessResponseDTO<Item[]> = new SuccessResponseDTO<
        Item[]
      >('GetItems Success', null, result);

      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      const response: FailResponseDTO = new FailResponseDTO(
        'GetItems Fail',
        e.message,
      );

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Get('detail/:itemId')
  async getItem(
    @Param('itemId') itemId: string,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: Item = await this.itemService.getItem(itemId);

      const response: SuccessResponseDTO<Item> = new SuccessResponseDTO<Item>(
        'GetItem Success',
        null,
        result,
      );

      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      const response: FailResponseDTO = new FailResponseDTO(
        'GetItem Fail',
        e.message,
      );

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Post('create/:userId')
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

      const response: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('CreateItem Success', result);

      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      const response: FailResponseDTO = new FailResponseDTO(
        'CreateItem Fail',
        e.message,
      );

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Put('modify/:itemId')
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

      const response: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('ModifyItem Success', result);

      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      const response: FailResponseDTO = new FailResponseDTO(
        'ModifyItem Fail',
        e.message,
      );

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Delete('delete?')
  async deleteItem(
    @Query('userId') userId: string,
    @Query('itemId') itemId: string,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const result: string = await this.itemService.deleteItem(userId, itemId);

      const response: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('DeleteItem Success', result);

      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      const response: FailResponseDTO = new FailResponseDTO(
        'DeleteItem Fail',
        e.message,
      );

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
