import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [UserService, PostService, CategoryService]
})
export class CategoryDetailComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public category: Category;
  public posts: any;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _postService: PostService,
    private _categoryService: CategoryService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    this.getPostsByCategory();
  }

  getPostsByCategory() {
    this._route.params.subscribe(params => {
      let id = Number(params['id']);

      this._categoryService.getCategory(id).subscribe(
        response => {
          if (response.status == 'success') {
            //console.log(response);
            this.category = response.category;

            this._categoryService.getPosts(id).subscribe(
              response => {
                if (response.status == 'success') {
                  this.posts = response.posts;
                } else {
                  this._router.navigate(['/inicio']);
                }
              },
              error => {
                console.log(<any>error);
              }
            );
          } else {
            this._router.navigate(['/inicio']);
          }
        },
        error => {
          console.log(<any>error);
        }
      )
    });
  }

  deletePost(id) {
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPostsByCategory();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
