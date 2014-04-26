#include<stdio.h>
#include<stdlib.h>

#define stack_initsize 50
#define stack_increment 10

typedef struct binode                              //�������Ľ�㣻
{
	char data;
	struct binode *lchild, *rchild;
}binode,*bitree;

typedef struct                                     //����ջ�Ľ�㣻 
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
	printf("If the node is null, please input ' '.\n ");                               //�����������Ľ�㣬
	creatbitree(tree);
	printf("\nThe traverse of previous order is ");                                  //����������Ľ�㣻
	prebitree(tree);
	printf("\nThe traverse of intermediate order is ");                               //����������Ľ�㣻
	//inbitree(tree);
	printf("\nThe traverse of ultimate order is ");                                   //����������Ľ�㣻
	//ulbitree(tree);
	return 0;
}


void creatbitree(bitree &T)                                                            //������������
{
	char a;
	scanf("%c", &a);
	if(a == ' ')                                                                       //�������ո��ʾ�ս�㣻
		T = NULL;
	else
	{
		if(!(T = (bitree)malloc(sizeof(binode))))
			return ;
		T->data = a;
		creatbitree(T->lchild);                                                       //�ݹ��������Ľ�㣻
		creatbitree(T->rchild);
	}
	return ;
}

void prebitree(bitree T)                                                             //���������
{
	stack s;
	bitree m;	
	while((T->lchild != NULL) || (T->rchild != NULL) || emptystack(s))	//������������������Ϊ�ջ�ջ��Ϊ��ʱѭ����										
	{
		printf("%3c", T->data);                                          //��ӡ����㣻
		if((T->lchild != NULL) && (T->rchild != NULL))                   //��������������Ϊ��ʱ������������Ϊ����㣬��������ջ��
		{
			pushstack(s, T->rchild);
			T = T->lchild;	
		}
		if((T->lchild != NULL) && (T->rchild == NULL))                   //����������Ϊ��������Ϊ��ʱ������������Ϊ����㣻
		{
			T = T->lchild;
		}
		if((T->lchild == NULL) && (T->rchild != NULL))                   //��������Ϊ����������Ϊ��ʱ������������Ϊ����㣻
		{
			T = T->rchild;
		}
		if((T->lchild == NULL) && (T->rchild == NULL))                   //������������Ϊ��ʱ����ӡҶ�ӽ��ֵ����ջһ��Ԫ�ز�������Ϊ����㣻
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
