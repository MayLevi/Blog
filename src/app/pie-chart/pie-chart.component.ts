import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import {UsersService} from '../users/users.service';
import {PostsService} from '../posts/posts.service';

// export const StatsPieChart: any[] = [
//   {email: 'Apple', numberOfPost: 100000},
//   {email: 'IBM', numberOfPost: 80000},
//   {email: 'HP', numberOfPost: 20000},
//   {email: 'Facebook', numberOfPost: 70000},
//   {email: 'TCS', numberOfPost: 12000},
//   {email: 'Google', numberOfPost: 110000},
//   {email: 'Wipro', numberOfPost: 5000},
//   {email: 'EMC', numberOfPost: 4000}
// ];


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  title = 'User Posts From All Posts';

  StatsPieChart: any[] = [];

  margin = {top: 20, right: 20, bottom: 30, left: 50};
  width: number;
  height: number;
  radius: number;

  arc: any;
  labelArc: any;
  labelPer: any;
  pie: any;
  color: any;
  svg: any;

  constructor(private userService:UsersService,private  postsService: PostsService) {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnInit() {

    this.userService.getAllUsers().subscribe(users => {
      this.postsService.groupByUsers().subscribe(posts => {
        posts.forEach(post => {
          users.find(user => user._id == post._id).numberOfPost = post.count;
        })
        let countPosts = 0;
        users.forEach(user => {
          if(user.numberOfPost){
            countPosts += user.numberOfPost;
          }
        })

        users.forEach(user => {
          if(user.numberOfPost){
            this.StatsPieChart.push({email: user.email, numberOfPost: user.numberOfPost * 100 / countPosts});
          }
        })
        this.initSvg();
        this.drawPie();
      })
    })
  }

  initSvg() {
    this.color = d3Scale.scaleOrdinal()
      .range(['#FFA500', '#00FF00', '#FF0000', '#6b486b', '#FF00FF', '#d0743c', '#00FA9A']);
    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0);
    this.labelArc = d3Shape.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

    this.labelPer = d3Shape.arc()
      .outerRadius(this.radius - 80)
      .innerRadius(this.radius - 80);

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.numberOfPost);

    this.svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + Math.min(this.width, this.height) + ' ' + Math.min(this.width, this.height))
      .append('g')
      .attr('transform', 'translate(' + Math.min(this.width, this.height) / 2 + ',' + Math.min(this.width, this.height) / 2 + ')');
  }

  drawPie() {
    const g = this.svg.selectAll('.arc')
      .data(this.pie(this.StatsPieChart))
      .enter().append('g')
      .attr('class', 'arc');
    g.append('path').attr('d', this.arc)
      .style('fill', (d: any) => this.color(d.data.email) );
    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => d.data.email);

    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelPer.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => d.data.numberOfPost + '%');
  }
}
