#include<stdio.h>
#include<stdlib.h>

#define stack_initsize 50
#define stack_increment 10

typedef struct binode                              //定义树的结点；
{
	char data;
	struct binode *lchild, *rchild;
}binode,*bitree;

typedef struct                                     //定义栈的结点； 
{
	bitree base;
	bitree top;
	int stacksize;
}stack;

void creatbitree(bitree &T);
void prebitree(bitree T);
void inbitree(bitree T);
void ulbitree(bitree T);
void bitreerout(bitree T);
void initstack(stack &s);
int emptystack(stack s);
void pushstack(stack &s, bitree &m);
void popstack(stack &s, bitree &m);

int main()
{
	bitree tree;
	printf("Please input the order of the tree that traverse previous order.\n");
	printf("If the node is null, please input ' '.\n ");                               //先序输入树的结点，
	creatbitree(tree);
	printf("\nThe traverse of previous order is ");                                  //先序遍历树的结点；
	prebitree(tree);
	printf("\nThe traverse of intermediate order is ");                               //中序遍历树的结点；
	//inbitree(tree);
	printf("\nThe traverse of ultimate order is ");                                   //后序遍历树的结点；
	//ulbitree(tree);
	return 0;
}


void creatbitree(bitree &T)                                                            //创建二叉树；
{
	char a;
	scanf("%c", &a);
	if(a == ' ')                                                                       //如果输入空格表示空结点；
		T = NULL;
	else
	{
		if(!(T = (bitree)malloc(sizeof(binode))))
			return ;
		T->data = a;
		creatbitree(T->lchild);                                                       //递归输入树的结点；
		creatbitree(T->rchild);
	}
	return ;
}

void prebitree(bitree T)                                                             //先序遍历；
{
	stack s;
	bitree m;	
	while((T->lchild != NULL) || (T->rchild != NULL) || emptystack(s))	//当左子树或右子树不为空或栈不为空时循环；										
	{
		printf("%3c", T->data);                                          //打印根结点；
		if((T->lchild != NULL) && (T->rchild != NULL))                   //当左右子树都不为空时，将左子树设为根结点，右子树入栈；
		{
			pushstack(s, T->rchild);
			T = T->lchild;	
		}
		if((T->lchild != NULL) && (T->rchild == NULL))                   //当左子树不为空右子树为空时，将左子树设为根结点；
		{
			T = T->lchild;
		}
		if((T->lchild == NULL) && (T->rchild != NULL))                   //当左子树为空右子树不为空时，将右子树设为根结点；
		{
			T = T->rchild;
		}
		if((T->lchild == NULL) && (T->rchild == NULL))                   //当左右子树都为空时，打印叶子结点值，出栈一个元素并将其作为根结点；
		{
			printf("%3c", T->data);
			popstack(s, m);
			T = m;
		}
	}
}
/*
void inbitree(bitree T)
{
	binode *m;
	while(T || emptystack())
	{
		if(T->lchild && T->rchild)
		{
			T = T->lchild;
			pushstack(s, T->rchild);
		}
		if(T->lchild && !T->rchild)
		{
			T = T->lchild;
		}
		if(!T->lchild && T->rchild)
		{
			T = T->rchild;
		}
		if(!T->lchild && !T->rchild)
		{
			printf("%3c", T->data);
			T = popstack(s, m);
		}

		}
	}
}

void ulbitree(bitree T)
{
	if(T)
	{
		ulbitree(T->lchild);
		ulbitree(T->rchild);
		printf("%3c", T->data);
	}
}


/*
void bitreerout(bitree T)
{
	char a;
	printf("Please input the value you want to find : ");
	scanf("%c", &a);
	if(T)
	{
		if(T->data != a)
		{
			bitreerout(T->lchild);
			bitreerout(T->rchild);
		}
		else
		{

		}
	}
}
*/

void initstack(stack &s)
{
	s.base = (bitree)malloc(stack_initsize * sizeof(binode));
	if (!s.base)
		exit(0);
	s.top = s.base;
	s.stacksize = stack_initsize;
}

int emptystack(stack s)
{
	if(s.top == s.base)
		return 1;
	else
		return 1;
}	

void pushstack(stack &s, bitree &m)
{
	if (s.top - s.base == s.stacksize)
	{
		s.base = (bitree)realloc(s.base, (stack_increment + s.stacksize) * sizeof(binode));
		if (!s.base)
			exit(0);
		s.stacksize += stack_increment;
		s.top = s.base + s.stacksize;
		}
	*s.top++ = *m;
}

void popstack(stack &s, bitree &m)
{
	if(s.top == s.base)
		exit(0);
	*m = *--s.top;
}
